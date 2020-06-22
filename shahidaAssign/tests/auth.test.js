const { User } = require('../Models/user');
const { Movie } = require('../Models/movie');
const request = require('supertest');
const bcrypt = require('bcrypt');

describe('Auth & Admin', () => {

    beforeEach(() => {
        server = require('../index');
    })
    afterEach(async () => {
        await User.remove({});
        await Movie.remove({});
        await server.close();
    })


    describe('/store/auth  POST', () => {
        it('returns token if authenticated', async () => {

            user = new User({ name: "saayra", email: 'saayra@gmail.com', password: '12345', isAdmin: true })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt)
            await user.save();

            const res = await request(server)
                .post('/store/auth')
                .send({ email: 'saayra@gmail.com', password: '12345' })
            const tokenCheck = { token: expect.any(String) };
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(tokenCheck)

        });

        it('returns 400 if unauthenticated', async () => {

            user = new User({ name: "saayra", email: 'saayra@gmail.com', password: '12345', isAdmin: true })
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt)
            await user.save();


            const res = await request(server)
                .post('/store/auth')
                .send({ email: 'saayra@gmail.com', password: '13457' })

            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid username or password')
        });

        it('returns 400 if password length is smaller than 5', async () => {

            const res = await request(server)
                .post('/store/auth')
                .send({ email: 'saayra@gmail.com', password: '1345' })

            expect(res.status).toBe(400);

        });

    });
    describe('/store/movies (GET,DELETE for auth and admin middleware)', () => {

        it('should return 200 if token is valid', async () => {
            const token = new User({ isAdmin: true }).generateAuthToken();
            const res = await request(server)
                .get('/store/movies')
                .set('x-auth-header', token)
            expect(res.status).toBe(200);
        });

        it('should return 401 if client is not logged in', async () => {
            const res = await request(server)
                .get('/store/movies')

            expect(res.status).toBe(401);
            expect(res.text).toBe('Access Denied! No token avaialable')
        });

        it('should return 400 if token is invalid', async () => {
            const token = 'abcd';
            const res = await request(server)
                .get('/store/movies')
                .set('x-auth-header', token)
            expect(res.status).toBe(400);
            expect(res.text).toBe('Invalid Token')
        });

        it('should delete movie if user is admin ', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' }
            ]);

            const token = new User({ isAdmin: true }).generateAuthToken();
            const res = await request(server)
                .delete('/store/movies/movie/CA1')
                .set('x-auth-header', token)

            expect(res.status).toBe(200);
            expect(res.body.deletedCount).toBe(1);
        });

        it('should deny access on deleting, if user is not admin', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' }
            ]);

            const token = new User({ isAdmin: false }).generateAuthToken();
            const res = await request(server)
                .delete('/store/movies/movie/CA1')
                .set('x-auth-header', token)

            expect(res.status).toBe(403);
            expect(res.text).toBe('Access Denied');
        });

    });
});