import 'reflect-metadata';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BackEndConfiguration } from '../../../src/models/eom/configuration/BackEndConfiguration';
import { plainToClass } from 'class-transformer';
import { HttpClient } from '../../../src/utils/HttpClient';

const server = setupServer(
    // Describe network behavior with request handlers.
    // Tip: move the handlers into their own module and
    // import it across your browser and Node.js setups!
    rest.get('http://my-rest-server/get', (req, res, ctx) => {
      return res(
        ctx.json([
          {
            id: 'f8dd058f-9006-4174-8d49-e3086bc39c21',
            title: `Avoid Nesting When You're Testing`,
          },
          {
            id: '8ac96078-6434-4959-80ed-cc834e7fef61',
            title: `How I Built A Modern Website In 2021`,
          },
        ]),
      )
    }),
    rest.get('http://my-rest-server/gets', (req, res, ctx) => {
        return res(ctx.status(404));
    }),
    rest.post('http://my-rest-server/post', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    result: 'success'
                }])
            );
    }),

    rest.post('http://my-rest-server/posts', (req, res, ctx) => {
        return res(ctx.status(404));
    }),
  )

const backendConfiguration = {
    "http": {
        "keepAlive": true,
        "keepAliveMsecs": 1000,
        "proxy": false,
        "rejectUnauthorized": false
    },
    "https": {
        "keepAlive": true,
        "keepAliveMsecs": 1000,
        "proxy": false,
        "rejectUnauthorized": false,
        "keyPath": "/etc/letsencrypt/live/yourdomain.com/privkey.pem",
        "certPath": "/etc/letsencrypt/live/yourdomain.com/fullchain.pem"
    },
    "graphdb": "",
    "graphdbconfigs": [
        {
            "name": "",
            "type": "blazegraph",
            "protocol": "http",
            "host": "localhost",
            "port": 0,
            "namespace": "sparql",
            "blazename": "blazegraph"
        }
    ]
};

const backEndConfiguration: BackEndConfiguration = plainToClass(BackEndConfiguration, backendConfiguration);
const httpClient = new HttpClient(backEndConfiguration);


describe("HttpClient", () => {
    test("Test get from a known existing end-point ", async () => {
        const response =  await httpClient.get("http://my-rest-server/get", {}, false).then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data.length).toEqual(2);
        }).catch((error) => {
            throw new Error(error);
        });
    });

    test("Test get from a known non-existing resource, so a 404", async () => {
        const response =  await httpClient.get("http://my-rest-server/gets", {}, false).then((response) => {
            throw new Error(response);
        }).catch((error) => {
            expect(error.name).toEqual("AxiosError");
        });
    });


    test("Test post to known existing end-point", async () => {
        const response = await httpClient.post("http://my-rest-server/post", "data", {}, false).then((response) => {
            expect(response.length).toEqual(1);
        }).catch((error) => {
            throw new Error(error);
        });
    });

    test("Test post to known non-existing resource, so a 404", async () => {
        const response = await httpClient.post("http://my-rest-server/posts", "data", {}, false).then((response) => {
            throw new Error(response);
        }).catch((error) => {
            expect(error.name).toEqual("AxiosError");
        });
    });

    // Enable request interception.
    beforeAll(() => server.listen())

    // Reset handlers so that each test could alter them
    // without affecting other, unrelated tests.
    afterEach(() => server.resetHandlers())

    // Don't forget to clean up afterwards.
    afterAll(() => server.close())

})