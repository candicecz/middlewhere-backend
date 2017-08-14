const bcrypt = require('bcrypt-as-promised');
const knex = require('knex')({ client: 'mysql' });

const validate = require('./validations');
const util = require('./util');

const HASH_ROUNDS = 10;
const USER_FIELDS = ['id', 'email', 'createdAt', 'updatedAt'];
const Project_FIELDS = ['id', 'ownerId', 'title', 'description', 'createdAt', 'updatedAt'];
const Project_WRITE_FIELDS = ['ownerId', 'title', 'description'];


const task_FIELDS = ['id', 'ProjectId', 'title', 'url', 'description', 'createdAt', 'updatedAt']; // added
const task_WRITE_FIELDS = ['ProjectId', 'title', 'url', 'description'];


class DashProjectlyDataLoader { // type of an object
  constructor(conn) {
    this.conn = conn;
  }


  query(sql) {
    return this.conn.query(sql);
  }

  // User methods
  createUser(userData) {
    const errors = validate.user(userData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }
    return bcrypt.hash(userData.password, HASH_ROUNDS)
    .then((hashedPassword) => {
      return this.query(
        knex
        .insert({
          email: userData.email,
          password: hashedPassword
        })
        .into('users')
        .toString()
      );
    })
    .then((result) => {
      return this.query(
        knex
        .select(USER_FIELDS)
        .from('users')
        .where('id', result.insertId)
        .toString()
      );
    })
    .then(result => {
      return result[0]})
    .catch((error) => {
      // Special error handling for duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('A user with this email already exists');
      } else {
        throw error;
      }
    });
  }

  deleteUser(userId) {
    return this.query(
      knex.delete().from('users').where('id', userId).toString()
    );
  }

  getUserFromSession(sessionToken) {
    return this.query(
      knex
      .select(util.joinKeys('users', USER_FIELDS))
      .from('sessions')
      .join('users', 'sessions.userId', '=', 'users.id')
      .where({
        'sessions.token': sessionToken
      })
      .toString()
    )
    .then((result) => {
      if (result.length === 1) {
        return result[0];
      }
      return null;
    });
  }

  createTokenFromCredentials(email, password) {
    const errors = validate.credentials({
      email: email,
      password: password
    });
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    let sessionToken;
    let user;

    return this.query(
      knex
      .select('id', 'password')
      .from('users')
      .where('email', email)
      .toString()
    )
    .then((results) => {
      console.log('112 ' ,results);
      if (results.length === 1) {
        user = results[0];
        return bcrypt.compare(password, user.password).catch(() => false);
      }
      console.log('116 ' ,results);
      return false;
    })
    .then((result) => {
      if (result === true) {
        return util.getRandomToken();
      }

      throw new Error('Username or password invalid');
    })
    .then((token) => {
      sessionToken = token;
      return this.query(
        knex
        .insert({
          userId: user.id,
          token: sessionToken
        })
        .into('sessions')
        .toString()
      );
    })
    .then(() => sessionToken);
  }

  deleteToken(token) {
    return this.query(
      knex
      .delete()
      .from('sessions')
      .where('token', token)
      .toString()
    )
    .then(() => true);
  }


  // Project methods
  getAllProjects(options) {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 20;
    const offset = (page - 1) * limit;

    return this.query(
      knex
      .select(project_FIELDS)
      .from('projects')
      .limit(limit)
      .offset(offset)
      .toString()
    );
  }

  getSingleProject(projectId) {
    return this.query(
      knex
      .select(project_FIELDS)
      .from('Projects')
      .where('id', projectId)
      .toString()
    );
  }

  createProject(projectData) {
    const errors = validate.project(ProjectData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }
    console.log('182 :: ' , ProjectData);
    return this.query(
      knex
      .insert(util.filterKeys(Project_WRITE_FIELDS, ProjectData))
      .into('Projects')
      .toString()
    )
    .then((result) => {
      return this.query(
        knex
        .select(project_FIELDS)
        .from('projects')
        .where('id', result.insertId)
        .toString()
      );
    });
  }

  projectBelongsToUser(projectId, userId) {
    return this.query(
      knex
      .select('id')
      .from('Projects')
      .where({
        id: projectId,
        ownerId: userId
      })
      .toString()
    )
    .then((results) => {
      if (results.length === 1) {
        return true;
      }

      throw new Error('Access denied');
    });
  }

  updateProject(projectId, projectData) {
    const errors = validate.projectUpdate(projectData);
    if (errors) {
      return Promise.reject({ errors: errors });
    }

    return this.query(
      knex('Projects')
      .update(util.filterKeys(project_WRITE_FIELDS, projectData))
      .where('id', projectId)
      .toString()
    )
    .then(() => {
      return this.query(
        knex
        .select(project_FIELDS)
        .from('projects')
        .where('id', projectId)
        .toString()
      );
    });
  }

  deleteProject(projectId) {
    return this.query(
      knex
      .delete()
      .from('projects')
      .where('id', projectId)
      .toString()
    );
  }

  // task methods
  getAllTasksForProject(projectId) {
    // TODO: this is up to you to implement :)
    console.log('trying to get tasks d259');
    return this.query(
      knex
      .select(task_FIELDS)
      .from('tasks')
      .where('projectId', projectId)
      .toString()
    );

  }

  createTask(taskData) {
    return this.query(
      knex
      .insert(util.filterKeys(task_WRITE_FIELDS, taskData))
      .into('tasks')
      .toString()
    )
    .then((result) => {
      return this.query(
        knex
        .select(task_WRITE_FIELDS)
        .from('tasks')
        .where('id', result.insertId)
        .toString()
      );
    });
  }

  taskBelongsToUser(taskId, userId) {
    // TODO: this is up to you to implement :)

    return this.query(
      knex
      .select('projectId')
      .from('tasks')
      .where({
        id: taskId
      })
      .toString()
    )

    .then((project) => {
      return (project[0].projectId);
    })
    .then((projectId) => {
      return this.query(
        knex
        .select('id')

        .from('Projects')
        .where({
          id: projectId,
          ownerId: userId
        })
        .toString()
      )

    })
    .then((results) => {
      if (results.length === 1) {
        return true;
      }

      throw new Error('Access denied');
    });
  }

  updateTask(taskId, taskData) {
    // TODO: this is up to you to implement :)

    return this.query(
      knex('tasks')

      .update(util.filterKeys(task_WRITE_FIELDS, taskData))
      .where('id', taskId)
      .toString()
    )
    .then(() => {
      return this.query(
        knex
        .select(task_FIELDS)
        .from('tasks')
        .where('id', taskId)
        .toString()
      );
    });

  }

  deleteTask(taskId) {
    // TODO: this is up to you to implement :)
    return this.query(
      knex
      .delete()
      .from('tasks')
      .where('id', taskId)
      .toString()
    );
  }
}

module.exports = MiddlewhereDataLoader;
