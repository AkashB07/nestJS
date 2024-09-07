import * as Joi from 'joi';
import { LogLevelEnum, NodeEnvEnum } from '../enum/config.enum';

const GENERAL_CONFIG_SCHEMA = {
  NODE_ENV: Joi.string()
    .valid(...Object.values(NodeEnvEnum))
    .default(NodeEnvEnum.LOCAL),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string()
    .valid(...Object.values(LogLevelEnum))
    .default(LogLevelEnum.INFO),
  ACCEPT_SOURCE_HEADER: Joi.boolean().default(false),
};

const TYPEORM_CONFIG_SCHEMA = {
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_PORT: Joi.number().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_DATABASE: Joi.string().required(),
  TYPEORM_SSL: Joi.boolean().default(false),
  TYPEORM_SYNCHRONIZE: Joi.boolean().required(),
  TYPEORM_LOGGING: Joi.string().default(false),
};

export const configValidator = Joi.object({
  ...GENERAL_CONFIG_SCHEMA,
  ...TYPEORM_CONFIG_SCHEMA,
});
