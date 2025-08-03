import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';

// Types d'actions
const INVESTMENT_ACTIONS = {
  SET_PORTFOLIO: 'SET_PORTFOLIO',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROPERTY_INVESTMENT: 'UPDATE_PROPERTY_INVESTMENT',
  SET_INVESTMENT_STATS: 'SET_INVESTMENT_STATS',
};

// État initial
const initialState = {
  portfolio: {
    totalInvested: 0,
    totalValue: 0,
    totalReturn: 0,
    properties: [],
    transactions: [],
  },
  investmentStats: {
    totalProperties: 0,
    averageReturn: 0,
    monthlyIncome: 0,
    yearlyIncome: 0,
  },
  loading: false,
  error: null,
};

// Reducer
const investmentReducer = (state, action) => {
  switch (action.type) {
    case INVESTMENT_ACTIONS.SET_PORTFOLIO:
      return {
        ...state,
        portfolio: action.payload,
      };

    case INVESTMENT_ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          transactions: [...state.portfolio.transactions, action.payload],
        },
      };

    case INVESTMENT_ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          transactions: state.portfolio.transactions.map(transaction =>
            transaction.id === action.payload.id ? action.payload : transaction
          ),
        },
      };

    case INVESTMENT_ACTIONS.UPDATE_PROPERTY_INVESTMENT:
      return {
        ...state,
        portfolio: {
          ...state.portfolio,
          properties: state.portfolio.properties.map(property =>
            property.id === action.payload.id ? action.payload : property
          ),
        },
      };

    case INVESTMENT_ACTIONS.SET_INVESTMENT_STATS:
      return {
        ...state,
        investmentStats: action.payload,
      };

    case INVESTMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case INVESTMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case INVESTMENT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Création du contexte
const InvestmentContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

// Provider du contexte
export const InvestmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(investmentReducer, initialState);

  // Actions
  const actions = {
    setPortfolio: (portfolio) => {
      dispatch({ type: INVESTMENT_ACTIONS.SET_PORTFOLIO, payload: portfolio });
    },

    addTransaction: (transaction) => {
      dispatch({ type: INVESTMENT_ACTIONS.ADD_TRANSACTION, payload: transaction });
    },

    updateTransaction: (transaction) => {
      dispatch({ type: INVESTMENT_ACTIONS.UPDATE_TRANSACTION, payload: transaction });
    },

    updatePropertyInvestment: (propertyInvestment) => {
      dispatch({ type: INVESTMENT_ACTIONS.UPDATE_PROPERTY_INVESTMENT, payload: propertyInvestment });
    },

    setInvestmentStats: (stats) => {
      dispatch({ type: INVESTMENT_ACTIONS.SET_INVESTMENT_STATS, payload: stats });
    },

    setLoading: (loading) => {
      dispatch({ type: INVESTMENT_ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: INVESTMENT_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: INVESTMENT_ACTIONS.CLEAR_ERROR });
    },
  };

  // Calculer les statistiques d'investissement
  const calculateInvestmentStats = (portfolio) => {
    const totalProperties = portfolio.properties.length;
    const totalInvested = portfolio.totalInvested;
    const totalValue = portfolio.totalValue;
    const totalReturn = portfolio.totalReturn;

    const averageReturn = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
    const monthlyIncome = totalReturn / 12; // Simplifié
    const yearlyIncome = totalReturn;

    return {
      totalProperties,
      averageReturn,
      monthlyIncome,
      yearlyIncome,
    };
  };

  // Mettre à jour les statistiques quand le portfolio change
  useEffect(() => {
    const stats = calculateInvestmentStats(state.portfolio);
    actions.setInvestmentStats(stats);
  }, [state.portfolio]);

  const value = {
    ...state,
    ...actions,
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};

InvestmentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InvestmentProvider; 