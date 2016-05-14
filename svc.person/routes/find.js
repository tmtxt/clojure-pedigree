'use strict';

const _ = require('lodash');
const router = require('koa-router')();
const util = require('./util.js');


/**
 * Find Root
 * @throws {Error}
 */
function* findRootHandler() {
  const logTrace = this.logTrace;
  const neoPerson = this.neo.person;
  const pgPerson = this.pg.Person;

  try {
    logTrace.add('info', 'neoPerson.findRoot()');
    const root = yield neoPerson.findRoot();

    if (!root) {
      throw {
        message: 'No root node found'
      };
    }

    logTrace.add('info', 'pgPerson.findOne()');
    const model = yield pgPerson.findOne({
      where: {id: root.personId}
    });

    if (!model) {
      throw {
        message: 'No model found',
        node: root
      };
    }

    let data = {
      model: model.getData(),
      node: root
    };
    logTrace.add('info', 'Root node found');
    this.body = {
      success: true,
      data
    };
  } catch (err) {
    logTrace.add('error', 'Find root fail', err);
    this.body = {
      success: false,
      message: err.message || 'Find root fail'
    };
  }
}


/**
 * Find person by id
 * @throws {Error}
 */
function* findByIdHandler() {
  var logTrace = this.logTrace;
  var personId = this.request.body.personId;
  personId = parseInt(personId);
  var pgPerson = this.pg.Person;
  var neoPerson = this.neo.person;

  try {
    logTrace.add('info', 'pgPerson.findById()');
    const model = yield pgPerson.findById(personId);
    if (!model) {
      throw {message: `Cannot find model with id ${personId}`};
    }

    const node = yield neoPerson.find(personId);
    if (!node) {
      throw {message: `Cannot find node with id ${personId}`};
    }

    logTrace.add('info', `Person with id ${personId} found`);
    this.body = {
      success: true,
      data: {
        entity: model.getData(),
        node
      }
    };
  } catch (err) {
    logTrace.add('error', 'Find person by id fail', err);
    this.body = {
      success: false,
      message: err.message || 'Find person by id fail'
    };
  }
}


/**
 * Find all persons by ids
 *
 * GET /find/byIds
 * {
 *  personIds: []
 * }
 */
function* findByIdsHandler() {
  const logTrace = this.logTrace;
  const pgPerson = this.pg.Person;
  const neoPerson = this.neo.person;

  let personIds = this.request.body.personIds;
  personIds = _.map(personIds, function(id){
    return parseInt(id);
  });
  logTrace.add('info', 'findByIdsHandler() - ids', personIds);

  // find all the person entities using ids
  logTrace.add('info', 'findByIdsHandler()', 'Find all person models by ids');
  const models = yield pgPerson.findByIds(personIds);

  // find all the nodes parallelly
  logTrace.add('info', 'findByIdsHandler()', 'Find all person nodes by ids');
  function* findNode(model, neoPerson) {
    const node = yield neoPerson.find(model.id);
    if (!node) {
      throw new Error(`Cannot find node with id person id ${model.id}`);
    }
    return { node, entity: model.getData() };
  }
  const tasks = _.map(models, function(model){
    return findNode(model, neoPerson);
  });
  const result = yield tasks;

  logTrace.add('info', 'findByIdsHandler()', 'Done!');
  this.body = {
    success: true,
    data: result
  };
}


router.get('/root', findRootHandler);
router.get('/byId', util.requireIdMdw, findByIdHandler);
router.get('/byIds', findByIdsHandler);

module.exports = router;
