const swaggerDefinition = {
    info: {
      title: 'Your API Title',
      version: '1.0.0',
      description: 'Your API Description',
    },
    basePath: '/',
  };
  

  const swaggerOptions = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./Router/*.js'], // Path to the API routes folder
  };
  

  
  module.exports ={ swaggerDefinition,swaggerOptions};

  