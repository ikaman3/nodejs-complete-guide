const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

const MONGODB_TEST_URL = require('../config/mongodb-info.json').testUrl;

describe('Auth Controller', function() {
    // 모든 테스트 이전에 단 한 번만 실행되는 함수
    before(function(done) {
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
                done();
            });
    });

    // 매 테스트 이전에 실행되는 함수
    beforeEach(function() {});
    // 매 테스트 이후에 실행되는 함수
    afterEach(function() {});
    
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
    });

    // 모든 테스트 이후에 단 한 번만 실행되는 함수
    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });
});