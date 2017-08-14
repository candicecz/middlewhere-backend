const validate = require('validate.js');

const VALID_ID = {
  onlyInteger: true,
  greaterThan: 0
};

const USER_VALIDATION = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
    length: {
      minimum: 12,
      message: 'must be at least 12 characters'
    }
  }
};
exports.user = function validateUser(userData) {
  return validate(userData, USER_VALIDATION);
};

const PROJECT_VALIDATION = {
  ownerId: {
    presence: true,
    numericality: VALID_ID
  },
  title: {
    presence: true
  }
};
exports.project = function validateProject(projectData) {
  return validate(projectData, PROJECT_VALIDATION);
};

const PROJECT_UPDATE_VALIDATION = {
  ownerId: {
    numericality: VALID_ID
  }
};
exports.projectUpdate = function validateProjectUpdate(projectData) {
  return validate(projectData, PROJECT_UPDATE_VALIDATION);
};

const CREDS_VALIDATION = {
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true
  }
};
exports.credentials = function validateCredentials(credsData) {
  return validate(credsData, CREDS_VALIDATION);
};
