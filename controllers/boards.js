const express = require('express');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const boardsController = express.Router();

  // Retrieve a list of boards
  boardsController.get('/', (req, res) => {
    dataLoader.getAllBoards({
      page: req.query.page,
      limit: req.query.count
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });

  // Retrieve a single board
  boardsController.get('/:id', (req, res) => {
    console.log("get board")
    dataLoader.getSingleBoard(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });


  // Create a new board
  boardsController.post('/', onlyLoggedIn, (req, res) => {

    console.log('boards.js OOOOO' , this.body);

    board_data = {
      ownerId: req.user.users_id,
      title: req.body.title,
      description: req.body.description
    };
    dataLoader.createBoard(board_data)
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json(err));
  });


  // Modify an owned board
  boardsController.patch('/:id', onlyLoggedIn, (req, res) => {
      return dataLoader.updateBoard(req.params.id, {
        title: req.body.title,
        description: req.body.description
    })
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
  });


  // Delete an owned board
  boardsController.delete('/:id', onlyLoggedIn, (req, res) => {
    // First check if the board to be DELETEd belongs to the user making the request
    dataLoader.boardBelongsToUser(req.params.id, req.user.id)
    .then(() => {
      return dataLoader.deleteBoard(req.params.id);
    })
    .then(() => res.status(204).end())
    .catch(err => res.status(400).json(err));
  });


  // Retrieve all the bookmarks for a single board
  boardsController.get('/:id/bookmarks', (req, res) => {
    // TODO: this is up to you to implement :)
    const this_board_id = req.params.id;
    dataLoader.getAllBookmarksForBoard(this_board_id)
    .then(data => res.json(data))
    .catch(err => res.status(400).json(err));
    // res.status(500).json({ error: 'not implemented' });
  });

  // Create a new bookmark under a board
  boardsController.post('/:id/bookmarks', onlyLoggedIn, (req, res) => {
    // TODO: this is up to you to implement :)
    const user_id = req.user.users_id;
    const board_id = Number(req.params.id);
    const bookmark_data = {
      boardId: board_id,
      title: req.body.title,
      url: req.body.url,
      description: req.body.description
    }
    dataLoader.boardBelongsToUser(board_id, user_id)
    .then(() => {
      dataLoader.createBookmark(bookmark_data) } )
    .then(data => res.status(201).json(data))
    .catch(err => res.status(400).json(err));
    // res.status(500).json({ error: 'not implemented' });
  });

  return boardsController;
};
