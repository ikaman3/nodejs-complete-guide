const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

const MONGODB_TEST_URL = require('../config/mongodb-info.json').testUrl;

describe('Feed Controller', function() {
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
    
    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };
        const res = { 
            status: function() {
                return this;
            }, 
            json: function() {} 
        };

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        }); 
    });

    // 모든 테스트 이후에 단 한 번만 실행되는 함수
    after(function(done) {
        User.deleteMany({})
            .then(() => {
                Post.deleteMany({})
                    .then(() => {
                        return mongoose.disconnect();
                    })
                    .then(() => {
                        done();
                    });
            });
    });
});