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
  USER_UPDATED: 'User updated successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: "Log out success",
  USERS_FOUND: 'Users found',
  
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

  // invitation
  INVITATION_EXPIRED: "Invitation expired. Please contact the Organization",
  INVITATION_SENT: "Invitation sent",
  INVITATION_ALREADY_USED:"Invitation is already used",
  

  // Organization
  ORG_NOT_FOUND: 'Organization not found',
  ORG_CREATED: 'Organization created',
  ORG_DELETED: 'Organization delete',
  ORG_UPDATED: 'Organization updated',
  ORG_FOUND: 'Organization found',
  ORG_VERIFIED: 'Organization verified',
  ORG_ALREADY_EXISTS: 'Organization already exists',
  ORG_JOIN_SUCCESS: "Successfully joined organization",

  //project
  PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_CREATED: 'Project created',
  PROJECT_DELETED: 'Project delete',
  PROJECT_UPDATED: 'Project updated',
  PROJECT_FOUND: 'Project found',
  PROJECT_ALREADY_EXISTS: 'Project already exists',

  //task
  TASK_NOT_FOUND: 'Task not found',
  TASK_CREATED: 'Task created',
  TASK_DELETED: 'Task delete',
  TASK_UPDATED: 'Task updated',
  TASK_FOUND: 'Task found',
  TASK_ALREADY_EXISTS: 'Task already exists',
  TASK_UPDATE_NOT_ALLOWED: 'This is not your task!',

  //meeting
   MEETING_NOT_FOUND: 'Meeting not found',
  MEETING_CREATED: 'Meeting created',
  MEETING_DELETED: 'Meeting delete',
  MEETING_UPDATED: 'Meeting updated',
  MEETING_FOUND: 'Meeting found',


  //Authorization
  FORBIDDEN: 'You are not authorized to perform this action',
};
