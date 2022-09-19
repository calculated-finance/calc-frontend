const components = {
  Button: {
    baseStyle: {
      borderRadius: 'lg',
      fontSize: 'sm',
    },
    defaultProps: {
      colorScheme: 'brand',
      size: 'sm',
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
};

export default components;
