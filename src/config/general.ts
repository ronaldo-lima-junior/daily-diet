import { env } from '../env'

interface IGeneralConfig {
  port: number
  name: string
  enviroment: string
}

const generalConfig: IGeneralConfig = {
  enviroment: env.NODE_ENV,
  port: Number(env.PORT),
  name: 'Back-end',
}

export default generalConfig
