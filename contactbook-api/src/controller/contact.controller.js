const jsend = require('../jsend');
const contactService = require('../services/contacts.service');
const ApiError = require('../api-errors');
const path = require('path');

module.exports = {

    createContact : async (req,res,next) =>{
        if(!req.body?.name || typeof req.body.name !== 'string'){
            return next(ApiError(400, 'Name should be a non-empty string'));
        }
        try{
            const avatarPath = req.file ? path.join('/public/uploads', req.file.filename) : null;
            const contact = await contactService.createContact({
                ...req.body,
                avatar: avatarPath
            });
            return res.status(201).set('Location', `${req.baseUrl}/${contact.id}`).json(jsend.success({contact}));
        }catch(error){
            console.log(error);
            return next(ApiError(500, error.message));
        }

    },

    getContactsByFilter : async (req,res,next) => {
        let result = {
            contacts: [],
            metadata: {
                totalContacts: 0,
                firstPage: 1,
                lastPage: 1,
                page: 1,
                limit: 5
            }
        };

        try{
            result = await contactService.getManyContacts(req.query);
        }catch (error){
            console.log(error);
            return next( new ApiError(500, error.message));
        }

        return res.json(jsend.success({
            contacts: result.contacts,
            metadata: result.metadata
        }));
    },

    getContact : async (req,res, next) => { 
        const {id } = req.params;

        try{
            const contact = await contactService.getContactById(id);
            if(!contact){
                return next(new ApiError(404, 'Contact not found'));
            }
            return res.json(jsend.success({contact}));
        }catch(error){
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    },  

    updateContact : async (req,res,next) => { 
        if(Object.keys(req.body).length === 0 && !req.file){
            return next(new ApiError(400, 'No data to update'));
        }

        const {id} = req.params;

        try{
            const update =  await contactService.updateContact(id, {
                ...req.body,
                avatar: req.file ? path.join('/public/uploads', req.file.filename) : null
            });

            if(!update){
                return next(new ApiError(400, 'Failed to update contact'));
            }

            return res.json(jsend.success({contact: update}));
        }catch(error){
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    },

    deleteContact : async (req,res,next) => {
        const {id} = req.params;

        try{
            const deleted = await contactService.deleteContact(id);
            if(!deleted){
                return next(new ApiError(400, 'Failed to delete contact'));
            }
            return res.json(jsend.success({message: 'Contact deleted successfully'}));
        }catch(error){
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    },

    deleteAllContacts : async (req,res,next) => {
        try{
            await contactService.deleteAllContacts();
            return res.json(jsend.success({message: 'All contacts deleted successfully'}));
        }catch(error){
            console.log(error);
            return next(new ApiError(500, error.message));
        }
    }
}

