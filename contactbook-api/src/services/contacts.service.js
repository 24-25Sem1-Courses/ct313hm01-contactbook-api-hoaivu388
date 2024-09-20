const knex = require('../database/knex')
const Paginator = require('./paginator');

class ContactService {

    contactRepository() {
        return knex('contacts');
    }

    readContact(payload){
        return {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
            avatar: payload.avatar,

        }
    }
    
    async createContact(payload){
        const contact = this.readContact(payload);
        const [id] = await this.contactRepository().insert(contact);
        return {id, ...contact};
    }

    async getManyContacts(query){
        const {name, favorite, page, limit} = query;
        const paginator = new Paginator(page, limit);

        let result = await this.contactRepository().
        where((builder) => {
            if(name){
                builder.where('name', 'like', `%${name}%`);
            }
            if(favorite !== undefined &&
                favorite !== '0' &&
                favorite !== 'false'
            ){
                builder.where('favorite', 1);
            }
        })
        .select(
            knex.raw('count(id) OVER() AS recordCount'),
            'id',
            'name',
            'email',
            'address',
            'phone',
            'favorite',
            'avatar'
        )
        .limit(paginator.limit)
        .offset(paginator.offset);

        let totalRecords = 0;
        result = result.map((result) => {
            totalRecords = result.recordCount;
            delete result.recordCount;
            return result;
        });

        return {
            metadata: paginator.getMetadata(totalRecords),
            contacts: result
        }
        
    }
      
    async getContactById(id){
        return this.contactRepository().where('id', id).first();
    }

    async updateContact(id, payload){
        const updateContact = await this.contactRepository().where('id', id).select('*').first();
        if(!updateContact){
            return null;
        }
        const contact = this.readContact(payload);
        if(!contact.avatar){
            delete contact.avatar;
        }
        await this.contactRepository().where('id', id).update(contact);
        if(
            contact.avatar &&
            updateContact.avatar &&
            contact.avatar !== updateContact.avatar &&
            updateContact.avatar.startsWith('/public/uploads')
        ){
            unlink(`.${updateContact.avatar}`, (err) => {});
        }
        return {...updateContact, ...contact};
    }

    async deleteContact(id){
        const contact = await this.contactRepository().where('id', id).select('avatar').first();
        if(!contact){
            return null;
        }
        await this.contactRepository().where('id', id).del();
        if(deleteContact.avatar && deleteContact.avatar.startsWith('/public/uploads')){
            unlink(`.${deleteContact.avatar}`, (err) => {});
        }
        return contact;
    }

    async deleteAllContacts(){
        const contacts = await this.contactRepository().select('avatar');
        await this.contactRepository().del();

        contacts.forEach((contact) => {
            if(contact.avatar && contact.avatar.startsWith('/public/uploads')){
                unlink(`.${contact.avatar}`, (err) => {});
            }
        });
        return contacts;
    }
}
module.exports = new ContactService();