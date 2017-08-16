const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const tasksController = express.Router();


  //
  // tasksController.get('/', onlyLoggedIn, (req, res) => {
  //     const users_id = req.user.users_id;
  //     dataLoader.taskBelongsToUser(users_id)
  //     .then(() => dataLoader.updatetask(req.params.id, real_data))
  //     .then(data => {
  //       console.log(data);
  //     return res.json(data)})
  //     .catch(err => res.status(400).json(err));
  // });


  // Modify a task
  tasksController.patch('/:id', onlyLoggedIn, (req, res) => {
      // ** MOCK DATA *******************
      const mock_user = 1;
      const mock_data = {
        title: "how to run quickly -- ger -- er",
        projectId : 1,
        url:"bolt.com" // req.body ...
      } // ******************************
      const real_data = {
        title: req.body.title,
        projectId : req.body.projectId,
        url: req.body.url,
        description: req.body.description
      }
      const real_user = req.user.users_id;
      dataLoader.taskBelongsToUser(req.params.id, real_user)
      .then(() => dataLoader.updatetask(req.params.id, real_data))
      .then(data => {
        console.log(data);
      return res.json(data)})
      .catch(err => res.status(400).json(err));

  });
  // Retrieve a list of projects
  // projectsController.get('/', (req, res) => {
  //   dataLoader.getAllprojects({
  //     page: req.query.page,
  //     limit: req.query.count
  //   })
  //   .then(data => res.json(data))
  //   .catch(err => res.status(400).json(err));
  // });

  // Delete a task
  tasksController.delete('/:id', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    const real_user = req.user.users_id; //
    const task_id = req.params.id;

    dataLoader.taskBelongsToUser(task_id, real_user)
    .then(() => {
      return dataLoader.deletetask(task_id);
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json(err));
  });

  return tasksController;
};
