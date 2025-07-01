import { app } from './app'
import generalConfig from './config/general'

app
  .listen({
    port: generalConfig.port,
  })
  .then(() => {
    console.log(
      `\n ${generalConfig.name} iniciado na porta ${generalConfig.port}`,
    )
  })
