<html>
  <head>
    <title>API Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script>
      const ui = SwaggerUIBundle({
        url: "https://coincompanionswagger.s3.ap-southeast-2.amazonaws.com/swagger.yaml",  // Replace with your S3 URL
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    </script>
  </body>
</html>
