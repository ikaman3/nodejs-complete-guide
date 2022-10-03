const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function() {
    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'abc123'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', function(done) {
        mongoose.connect('mongodb+srv://Max:sadqqwdsa@cluster0.bcol3h1.mongodb.net/test-messages')
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'abc123',
                    name: 'Tester',
                    posts: []
                });
                return user.save();
            })
            .then(() => {
                
            })
            .catch(err => console.log(err));
    });
});