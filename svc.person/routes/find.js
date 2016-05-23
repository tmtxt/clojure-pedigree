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
  const readable = _.get(this, ['request', 'body', 'readable']);

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
      model: model.getData({readable}),
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
  const logTrace = this.logTrace;
  var personId = this.request.body.personId;
  personId = parseInt(personId);
  const pgPerson = this.pg.Person;
  const neoPerson = this.neo.person;
  const readable = this.request.body.readable;

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
        entity: model.getData({readable}),
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
  const readable = this.request.body.readable;

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
      throw new Error(`Cannot find node with person id ${model.id}`);
    }
    return { node, entity: model.getData({readable}) };
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


/**
 * Find all person by name using iLIKE
 *
 * GET /find/byName
 * {
 * name: 'some name'
 * }
 */
function* findByNameHandler() {
  const logTrace = this.logTrace;
  const pgPerson = this.pg.Person;
  const neoPerson = this.neo.person;
  const name = this.request.body.name;
  const readable = this.request.body.readable;

  // find all the entities using name
  logTrace.add('info', 'findByNameHandler()', 'Find models by name');
  const models = yield pgPerson.findByName(name);

  // find all the node parallelly
  function* findNode(model) {
    const node = yield neoPerson.find(model.id);
    if (!node) {
      throw new Error(`Cannot find node with with person id ${model.id}`);
    }

    return { node, entity: model.getData({readable}) };
  }
  logTrace.add('info', 'findByNameHandler()', 'Find nodes by person id');
  const tasks = _.map(models, function(model){
    return findNode(model, neoPerson);
  });
  const result = yield tasks;

  logTrace.add('info', 'findByNameHandler()', 'Done!');
  this.body = {
    success: true,
    data: result
  };
}


/**
 * Find all person by gender using IN
 *
 * GET /find/byGenders
 * {
 * genders: ['male', 'female']
 * }
 */
function* findByGendersHandler() {
  const logTrace = this.logTrace;
  const pgPerson = this.pg.Person;
  const neoPerson = this.neo.person;
  const genders = this.request.body.genders;
  const readable = this.request.body.readable;

  // find all the entities using name
  logTrace.add('info', 'findByGendersHandler()', 'Find models by genders');
  const models = yield pgPerson.findByGenders(genders);

  // find all the node parallelly
  function* findNode(model) {
    const node = yield neoPerson.find(model.id);
    if (!node) {
      throw new Error(`Cannot find node with with person id ${model.id}`);
    }

    return { node, entity: model.getData({readable}) };
  }
  logTrace.add('info', 'findByGendersHandler()', 'Find nodes by person id');
  const tasks = _.map(models, function(model){
    return findNode(model, neoPerson);
  });
  const result = yield tasks;

  logTrace.add('info', 'findByGendersHandler()', 'Done!');
  this.body = {
    success: true,
    data: result
  };
}


router.get('/root', findRootHandler);
router.get('/byId', util.requireIdMdw, findByIdHandler);
router.get('/byIds', findByIdsHandler);
router.get('/byName', findByNameHandler);
router.get('/byGenders', findByGendersHandler);

module.exports = router;
