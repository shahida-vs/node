const request = require('supertest');
const { Movie } = require('../Models/movie');
const { User } = require('../Models/user');

let server;
describe('/store/movies', () => {

    beforeEach(() => { server = require('../index'); })
    afterEach(async () => {
        await Movie.remove({});
        await server.close();
    })
    describe(' GET /', () => {

        it('should return movies on first page when page no. is not given', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' },
                { title: 'Shutter Island', noInStock: 8, dailyRentalRate: 90, movieId: 'SI1' }
            ]);
            //
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/store/movies')
                .set('x-auth-header', token)
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.title === 'Cast Away')).toBeTruthy();
            expect(res.body.some(c => c.title === 'Shutter Island')).toBeTruthy();
        });

        it('should skip first 2 movies on giving page no. 2', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' },
                { title: 'Shutter Island', noInStock: 8, dailyRentalRate: 90, movieId: 'SI1' },
                { title: 'Raabta', noInStock: 4, dailyRentalRate: 70, movieId: 'R1' },
                { title: 'MS. Dhoni', noInStock: 10, dailyRentalRate: 60, movieId: 'MD1' }
            ]);
            //
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/store/movies/2')
                .set('x-auth-header', token)
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.title === 'Raabta')).toBeTruthy();
            expect(res.body.some(c => c.title === 'MS. Dhoni')).toBeTruthy();
        });
        it('should return 400 on giving invalid page no.', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' },
                { title: 'Shutter Island', noInStock: 8, dailyRentalRate: 90, movieId: 'SI1' }
            ]);
            //
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/store/movies/m')
                .set('x-auth-header', token)
            expect(res.status).toBe(400);
        });
    });
    describe(' GET/:id /', () => {

        it('should return movie with given movieId', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' },
                { title: 'Shutter Island', noInStock: 8, dailyRentalRate: 90, movieId: 'SI1' }
            ]);
            //
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/store/movies/movie/CA1')
                .set('x-auth-header', token)

            expect(res.status).toBe(200);
            expect(res.body.title === 'Cast Away').toBeTruthy();
        });

        it('should return 400 when given movieId does not exist', async () => {

            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' },
                { title: 'Shutter Island', noInStock: 8, dailyRentalRate: 90, movieId: 'SI1' }
            ]);
            //
            const token = new User().generateAuthToken();
            const res = await request(server)
                .get('/store/movies/movie/jkl')
                .set('x-auth-header', token)

            expect(res.status).toBe(400);
            expect(res.text).toBe('movie id does not exist');
        });
    });

    describe(' POST/ ', () => {
        it('should return movie that is created', async () => {

            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/store/movies/')
                .set('x-auth-header', token)
                .send({ title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' })
            expect(res.status).toBe(200);
            expect(res.body.title === 'Cast Away').toBeTruthy();
        });


        it('should return 400 when movieId already exists', async () => {
            await Movie.collection.insertMany([
                { title: 'Cast Away', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' }
            ]);

            const token = new User().generateAuthToken();

            const res = await request(server)
                .post('/store/movies/')
                .set('x-auth-header', token)
                .send({ title: 'Raabta', noInStock: 5, dailyRentalRate: 80, movieId: 'CA1' })
            expect(res.status).toBe(400);
            expect(res.text).toBe('movieId already exists');
        });
    });
});


