const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

const MONGODB_TEST_URL = require('../config/mongodb-info.json').testUrl;

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
        mongoose.connect(MONGODB_TEST_URL)
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'abc123',
                    name: 'Tester',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                const req = { userId: '5c0f66b979af55031b34728a' };
                const res = {
                    statusCode: 500,
                    userStatus: null,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.userStatus = data.status;
                    }
                };
                AuthController.getUserStatus(req, res, () => {}).then(() => {
                    expect(res.statusCode).to.be.equal(200);
                    expect(res.userStatus).to.be.equal('I am new!');
                    done();
                });
            })
            .catch(err => console.log(err));
    });
});