const swagger = require('swagger-ui-express')
const SwaggerParser = require('@apidevtools/swagger-parser')

async function setupSwagger(app) {
    try {
        const api = await SwaggerParser.dereference('./docs/api.yaml')
        app.use('/api', swagger.serve, swagger.setup(api))
        console.log('Swagger UI is set up at /api')
    } catch (err) {
        console.error('Failed to load swagger docs:', err)
    }
}

module.exports = setupSwagger