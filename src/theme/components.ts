const components = {
  Button: {
    // baseStyle: ({ theme }) => {
    //   console.log(theme.components.Modal);
    //   console.log(theme.components.Modal);
    //   return {
    //     borderRadius: 'lg',
    //     fontSize: 'sm',
    //   };
    // },
    baseStyle: {
      borderRadius: 'lg',
      fontSize: 'sm',
    },
    defaultProps: {
      colorScheme: 'brand',
      size: 'sm',
    },
  },
  Alert: {
    baseStyle: {
      container: {
        borderRadius: '2xl',
        px: 6,
        py: 4,
        boxShadow: 'deepHorizon',
      },
    },
    variants: {
      subtle: {
        container: {
          bg: 'deepHorizon',
        },
      },
    },
  },
  Link: {
    baseStyle: {
      color: 'blue.200',
      fontWeight: 'bold',
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: 'lg',
      textTransform: 'none',
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: 'xl',
        borderColor: 'slateGrey',
        borderWidth: 1,
        bg: 'abyss.200',
      },
    },
    defaultProps: {
      variant: null, // null here
    },
  },

  Input: {
    variants: {
      outline: {
        field: {
          borderRadius: 'xl',
          borderColor: 'slateGrey',
          borderWidth: 1,
          bg: 'abyss.200',
        },
      },
      filled: {
        field: {
          borderRadius: 'xl',
          borderColor: 'slateGrey',
          borderWidth: 1,
          bg: 'darkGrey',
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  NumberInput: {
    variants: {
      outline: {
        field: {
          borderRadius: 'xl',
          borderColor: 'slateGrey',
          borderWidth: 1,
          bg: 'abyss.200',
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  Form: {
    baseStyle: {
      helperText: {
        pb: 2,
        textStyle: 'body-xs',
      },
    },
  },
  FormError: {
    baseStyle: {
      text: {
        fontSize: 'xs',
      },
    },
  },
  List: {
    baseStyle: {
      item: {
        textStyle: 'body',
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'darkGrey',
        borderRadius: '2xl',
      },
      body: {
        pt: 0,
        pb: 6,
      },
      header: {
        textAlign: 'center',
        p: 6,
      },
    },
    defaultProps: {
      size: 'lg',
      isCentered: true,
    },
  },
};

export default components;
