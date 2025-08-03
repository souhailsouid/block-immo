import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInvestment as useInvestmentContext } from '../context/InvestmentContext';
import investmentService from '../services/api/modules/investments/investmentService';

export const useInvestment = () => {
  const queryClient = useQueryClient();
  const { addTransaction, updatePropertyInvestment, setLoading, setError } = useInvestmentContext();

  // Query pour récupérer le portfolio
  const {
    data: portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => investmentService.getPortfolio('current-user'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query pour récupérer les statistiques
  const {
    data: investmentStats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['investment-stats'],
    queryFn: () => investmentService.getInvestmentStats('current-user'),
    staleTime: 5 * 60 * 1000,
  });

  // Query pour récupérer les transactions récentes
  const {
    data: recentTransactions,
    isLoading: transactionsLoading,
    error: transactionsError
  } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => investmentService.getRecentTransactions('current-user', 10),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Query pour récupérer les recommandations
  const {
    data: recommendations,
    isLoading: recommendationsLoading,
    error: recommendationsError
  } = useQuery({
    queryKey: ['investment-recommendations'],
    queryFn: () => investmentService.getInvestmentRecommendations('current-user'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation pour acheter des parts
  const buySharesMutation = useMutation({
    mutationFn: (purchaseData) => investmentService.buyShares(purchaseData),
    onSuccess: (result, variables) => {
      // Ajouter la transaction au contexte
      const transaction = {
        transactionId: result.data.transactionId,
        investmentId: result.data.investmentId,
        propertyId: variables.propertyId,
        propertyTitle: result.data.propertyTitle,
        amount: variables.investment,
        blocks: variables.blocks,
        status: result.data.status,
        timestamp: result.data.timestamp,
        type: 'PURCHASE',
        returnRate: result.data.returnRate,
      };
      
      addTransaction(transaction);

      // Mettre à jour le cache du portfolio
      queryClient.invalidateQueries(['portfolio']);
      queryClient.invalidateQueries(['investment-stats']);
      queryClient.invalidateQueries(['recent-transactions']);

      // Mettre à jour la propriété dans le cache
      queryClient.invalidateQueries(['property', variables.propertyId]);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  // Mutation pour simuler un investissement
  const simulateInvestmentMutation = useMutation({
    mutationFn: (simulationData) => investmentService.simulateInvestment(simulationData),
    onError: (error) => {
      setError(error.message);
    },
  });

  // Mutation pour vérifier la disponibilité
  const checkAvailabilityMutation = useMutation({
    mutationFn: (propertyId) => investmentService.checkSharesAvailability(propertyId),
    onError: (error) => {
      setError(error.message);
    },
  });

  // Fonction pour acheter des parts
  const buyShares = async (purchaseData) => {
    setLoading(true);
    try {
      const result = await buySharesMutation.mutateAsync(purchaseData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour simuler un investissement
  const simulateInvestment = async (simulationData) => {
    const result = await simulateInvestmentMutation.mutateAsync(simulationData);
    return result;
  };

  // Fonction pour vérifier la disponibilité
  const checkAvailability = async (propertyId) => {
    const result = await checkAvailabilityMutation.mutateAsync(propertyId);
    return result;
  };

  return {
    // Données
    portfolio,
    investmentStats,
    recentTransactions,
    recommendations,
    
    // États de chargement
    portfolioLoading,
    statsLoading,
    transactionsLoading,
    recommendationsLoading,
    isLoading: buySharesMutation.isPending,
    
    // Erreurs
    portfolioError,
    statsError,
    transactionsError,
    recommendationsError,
    error: buySharesMutation.error,
    
    // Actions
    buyShares,
    simulateInvestment,
    checkAvailability,
    refetchPortfolio,
    
    // États des mutations
    isBuying: buySharesMutation.isPending,
    isSimulating: simulateInvestmentMutation.isPending,
    isCheckingAvailability: checkAvailabilityMutation.isPending,
  };
};

export default useInvestment; 