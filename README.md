# HelpAPI

This is a simple API built on [NestJS](https://github.com/nestjs/nest)

It's an implementation of a relatively simple business case to manage the delivery of Help Pages to users under certain conditions.


## What you will find

I think this is a pretty good starter, or boilerplate, I've tried to keep things as simple as possible, but there is already most of what you'll need for any API.

I don't like too many folders, nor too many files in folders, so I've taken a few design choices to keep the balance that I like:
 - on folder per module, with no subfolders
 - each module folder has the entity, module, controller and service files
 - dtos of the same module in one file
 - auth module separate from users module
 - a separate 'common' folder with decorators, interfaces, guards and enums

## What it does

There are Users and Help Pages.

Users are authenticated via JWT and can be ADMIN or REGULAR.

ADMIN users can manage users and make any operation on Help Pages.

REGULAR users can be given permissions as VIEWER or EDITOR for each Help Page, those permissions are established in a separate table with a ManyToMany relation with custom properties.

REGULAR users that don't have any relation with a Help Page, cant make any operation on the Help Page.

Regular users that have a VIEWER relation with a Help Page, can GET the Help Page.

Regular users that have a EDITOR relation with a Help Page, can GET, PATCH and DELETE the Help Page.

Permissions are assigned only by ADMIN users.

## Roadmap
- [x] Initial API version
- [ ] Nuxt frontend
- [ ] Improve this README.md, add a guide
- [ ] Clean the code
- [ ] Unit tests
- [ ] Add OpenAPI (Swagger) generation
- [ ] Add Topics module 
- [ ] Implement Help Page generation from Topics
- [ ] Implement Help Page version management

## Credits
I've built this while coding along some tutorials, to learn NestJS.

Thanks [Ariel Weinberger](https://github.com/arielweinberger) and [Rodrigo Rios](https://github.com/rodrigoalejandrorios), for the excellent tutorials.