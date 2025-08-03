import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyDetails, updateProperty } from '../services/api/modules/properties/propertyService';

export const usePropertyDetails = (propertyId) => {
  const queryClient = useQueryClient();

  // Query pour récupérer les détails
  const {
    data: property,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => getPropertyDetails(propertyId),
    enabled: !!propertyId,
  });

  // Mutation pour mettre à jour
  const updateMutation = useMutation({
    mutationFn: ({ propertyId, data }) => updateProperty(propertyId, data),
    onSuccess: (updatedProperty, variables) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['property', variables.propertyId], updatedProperty);
      
      // Invalider et refetch pour s'assurer de la cohérence
      queryClient.invalidateQueries(['property', variables.propertyId]);
      
      // Optionnel : Invalider aussi la liste des propriétés
      queryClient.invalidateQueries(['properties']);
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
    }
  });

  return {
    property,
    isLoading,
    error,
    refetch,
    updateProperty: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error
  };
};