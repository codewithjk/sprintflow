export const Messages = {
  // General
  SERVER_ERROR: 'Something went wrong. Please try again later.',

  // JWT-specific errors
  JWT_TOKEN_MISSING: "Authentication token is missing.",
  JWT_TOKEN_INVALID: "Invalid authentication token.",
  JWT_TOKEN_EXPIRED: "Token has expired. Please log in again.",
  JWT_TOKEN_MALFORMED: "Malformed token. Unable to parse.",
  JWT_TOKEN_SIGNATURE_INVALID: "Invalid token signature.",
  JWT_PAYLOAD_INVALID: "Invalid token payload.",
  JWT_AUTHORIZATION_HEADER_MISSING: "Authorization header is missing.",
  JWT_ACCESS_DENIED: "Access denied. You do not have permission.",

  // Auth
  
  USER_NOT_FOUND: 'User not found',
  USER_CREATED: 'User created successfully',
  USER_VERIFIED: 'User verified successfully',
  LOGIN_SUCCESS:'Logged in successfully',
  
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_EMAIL: 'Invalid email',
  INVALID_PASSWORD: 'Invalid password',
  EMAIL_AND_PASSWORD_REQUIRED : "email and password required.",
  SIGNUP_SUCCESS: 'User created successfully',
  OTP_SENT: 'OTP sent to your email. Please verify to complete signup.',
  EMAIL_ALREADY_VERIFIED: 'Email is already verified.',
  EMAIL_NOT_VERIFIED: 'Please verify your email to continue.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_INVALID: 'Invalid OTP. Please check and try again.',
  OTP_VERIFIED: 'OTP verified successfully.',
  ACCOUNT_ALREADY_VERIFIED: 'Your account is already verified.',
  OAUTH_USER_CANNOT_LOGIN_WITH_PASSWORD :"Use other methods to login.",

  // Validation
  MISSING_FIELDS: 'Required fields are missing',
  INVALID_EMAIL_FORMAT: 'Email format is invalid',
  INVALID_PARAMS: "Invalid parameters",
  

  // Organization
  ORG_NOT_FOUND: 'Organization not found',
  ORG_CREATED: 'Organization created',
  ORG_DELETED: 'Organization delete',
  ORG_UPDATED: 'Organization updated',
  ORG_FOUND: 'Organization found',
  ORG_VERIFIED: 'Organization verified',
  ORG_ALREADY_EXISTS: 'Organization already exists',

  // Authorization
  FORBIDDEN: 'You are not authorized to perform this action',
};
