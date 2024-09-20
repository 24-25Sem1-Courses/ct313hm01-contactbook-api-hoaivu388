const express = require('express');
const contactsController = require('../controller/contact.controller');
const router = express.Router();
const errorsController = require('../controller/errors.controller');
const avatarUpload = require('../middlewares/avatar-upload.middleware');
module.exports.setup = (app) => {
app.use('/api/v1/contacts', router);

/**
 * @swagger
 * /api/v1/contacts:
 *   get:
 *     summary: Get all contacts
 *     description: Retrieve a list of all contacts
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the contact
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/pageParam'
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: The favorite status of the contact
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       description: The list of contacts
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *                     metadata:
 *                       $ref: '#/components/schemas/PaginationMetadata'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: An error message indicating the problem with the request
 *       404:
 *         description: No contacts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that no contacts were found
 */
router.get('/', contactsController.getContactsByFilter);

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     summary: Create a new contact
 *     description: Create a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     tags:
 *       - Contacts
 *     responses:  
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: An error message indicating the problem with the request
 *       409:
 *         description: Contact already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that the contact already exists
 */
router.post('/', avatarUpload, contactsController.createContact);

/**
 * @swagger
 * /api/v1/contacts:
 *   delete:
 *     summary: Delete all contacts
 *     description: Delete all contacts
 *     tags:
 *       - Contacts
 *     responses:   
 *       200:
 *         description: Contacts deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation
 *       404:
 *         description: No contacts found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that no contacts were found
 */
// router.delete('/', contactsController.deleteAllContacts);
router.all('/', errorsController.methodNotAllowed);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   get:
 *     summary: Get a contact by id
 *     description: Get a contact by id
 *     parameters:
 *       - $ref: '#/components/parameters/contactId'
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that the contact was not found
 */
router.get('/:id', contactsController.getContact);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   put:
 *     summary: Update a contact by id
 *     description: Update a contact by id
 *     parameters:
 *       - $ref: '#/components/parameters/contactId'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     tags:
 *       - Contacts
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 data:
 *                   type: object
 *                   properties:
 *                     contact:
 *                       $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that the contact was not found
 */
router.put('/:id', avatarUpload, contactsController.updateContact);

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   delete:
 *     summary: Delete a contact by id
 *     description: Delete a contact by id
 *     parameters:
 *       - $ref: '#/components/parameters/contactId'
 *     tags:    
 *       - Contacts
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [success]
 *                 message:
 *                   type: string
 *                   description: A message indicating the result of the operation
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the response
 *                   enum: [error]
 *                 message:
 *                   type: string
 *                   description: A message indicating that the contact was not found
 */
// router.delete('/:id', contactsController.deleteContact);
// router.all('/:id', errorsController.methodNotAllowed);
};
