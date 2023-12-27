// Enum defining the different environment types
export enum EnvType {
  LOCAL = 'local',
  DEVELOP = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

// Type defining the values for each environment type
export type IsUseEnvironmentValue = {
  [EnvType.LOCAL]: string | number | boolean;
  [EnvType.DEVELOP]: string | number | boolean;
  [EnvType.STAGING]: string | number | boolean;
  [EnvType.PRODUCTION]: string | number | boolean;
};

// Function to get the current environment
export const getEnv = (): string => {
  let env = EnvType.LOCAL;
  const nodeEnv = process.env.NODE_ENV || EnvType.LOCAL;

  if (nodeEnv.toLowerCase() === EnvType.DEVELOP) env = EnvType.DEVELOP;
  if (nodeEnv.toLowerCase() === EnvType.STAGING) env = EnvType.STAGING;
  if (nodeEnv.toLowerCase() === EnvType.PRODUCTION) env = EnvType.PRODUCTION;

  return env;
};

// Functions to check the current environment
export const isProduction = (): boolean => {
  return getEnv() === EnvType.PRODUCTION;
};

export const isDevelop = (): boolean => {
  return getEnv() === EnvType.DEVELOP;
};

export const isStaging = (): boolean => {
  return getEnv() === EnvType.STAGING;
};

export const isLocal = (): boolean => {
  return getEnv() === EnvType.LOCAL;
};

/**
 * Function to determine which environment value to use based on the current environment.
 * If no specific value is provided for the current environment, it falls back to the value of the next lower environment.
 * If no value is provided for any environment, it returns null.
 * @param values - Object containing values for each environment type
 * @returns The value to use for the current environment
 */
export const isUseEnvironment = (values: Partial<IsUseEnvironmentValue>) => {
  if (isLocal()) return values[EnvType.LOCAL] || values[EnvType.DEVELOP];
  if (isDevelop()) return values[EnvType.DEVELOP] || values[EnvType.LOCAL];
  if (isStaging()) return values[EnvType.STAGING] || values[EnvType.DEVELOP];
  if (isProduction()) return values[EnvType.PRODUCTION];

  return null;
};
