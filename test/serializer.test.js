var should, serializer;

should = require('chai').should();
ser    = require('../lib/serializer');

describe('# Serializer Test Suite', function () {

    describe('test request serialization', function () {
        describe('for invalid parameters', function () {
            var result = ser.request();

            it('should return an error object', function () {
                result.should.be.an('array');
                result.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
                result.should.include('Method should be a string. Received undefined instead');
            });
        });

        describe('for valid parameters', function () {
            var result1 = ser.request('id', 'method');
            var result2 = ser.request('id', 'method', 'params');
            var result3 = ser.request('id', 'method', ['param1', 'param2']);
            var result4 = ser.request('id', 'method', { param : 'foo' });

            it('should return a serialized string', function () {
                result1.should.be.a('string');
                result2.should.be.a('string');
                result3.should.be.a('string');
                result4.should.be.a('string');
            });
        });
    });

    describe('test notificaiton serialization', function () {
        describe('for invalid parameters', function () {
            var result = ser.notification();

            it('should return an error object', function () {
                result.should.be.an('array');
                result.should.include('Method should be a string. Received undefined instead');
            });
        });

        describe('for valid parameters', function () {
            var result1 = ser.notification('method');
            var result2 = ser.notification('method', 'params');
            var result3 = ser.notification('method', ['param1', 'param2']);
            var result4 = ser.notification('method', { param : 'foo' });

            it('should return a serialized string', function () {
                result1.should.be.a('string');
                result2.should.be.a('string');
                result3.should.be.a('string');
                result4.should.be.a('string');
            });
        });
    });

    describe('test success serialization', function () {
        describe('for invalid parameters', function () {
            var result = ser.success();

            it('should return an error object', function () {
                result.should.be.an('array');
                result.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
                result.should.include('Result must exist for success Response objects');
            }); 
        });

        describe('for valid parameters', function () {
            var result = ser.success('id', 'result');

            it('should return a serialized string', function () {
                result.should.be.a('string');
            });
        });
    });

    describe('test error serialization', function () {
        describe('for invalid parameters', function () {
            var result1 = ser.error();
            var result2 = ser.error('id', {});

            it('for 1 - should return an error object', function () {
                result1.should.be.an('array');
                result1.should.include('An ID must be provided. It must be either a string or an integer (no fractions allowed)');
                result1.should.include('Error must be an object conforming to the JSON-RPC 2.0 error object specs');
            });

            it('for 2 - should return an error object', function () {
                result2.should.be.an('array');
                result2.should.include('Error must be an instance of JsonRpcError, or any derivatives of it');
            });
        });

        describe('for valid parameters', function () {
            var result1 = ser.error('id', new ser.err.JsonRpcError('Crazy error'));
            var result2 = ser.error('id', new ser.err.ParseError());
            var result3 = ser.error('id', new ser.err.InvalidRequestError());
            var result4 = ser.error('id', new ser.err.MethodNotFoundError());
            var result5 = ser.error('id', new ser.err.InvalidParamsError());

            it('should return a serialized string', function () {
                result1.should.be.a('string');
                result2.should.be.a('string');
                result3.should.be.a('string');
                result4.should.be.a('string');
                result5.should.be.a('string');
            });
        });
    });

    describe('test deserialization', function () {
        describe('for invalid parameters', function () {
            var result1 = ser.deserialize();
            var result2 = ser.deserialize(JSON.stringify({ foo : 'bar' }));

            it('for 1 - should return a ParseError', function () {
                result1.should.be.instanceof(ser.err.ParseError);
            });

            it('for 2 - should return a InvalidRequestError', function () {
                result2.should.be.instanceof(ser.err.InvalidRequestError);
            });
        });

        describe('for request object', function () {
            var request = {
                jsonrpc : '2.0',
                id      : 'id',
                method  : 'method',
                params  : 'params'
            };

            var result = ser.deserialize(JSON.stringify(request));

            delete request.jsonrpc;

            it('should return a request object', function () {
                result.type.should.eql('request');
                result.payload.should.eql(request);
            });
        });

        describe('for notification object', function () {
            var notification = {
                jsonrpc : '2.0',
                method  : 'method',
                params  : 'params'
            };

            var result = ser.deserialize(JSON.stringify(notification));

            delete notification.jsonrpc;

            it('should return a notification object', function () {
                result.type.should.eql('notification');
                result.payload.should.eql(notification);
            });
        });

        describe('for success object', function () {
            var success = {
                jsonrpc : '2.0',
                id      : 'id',
                result  : 'result'
            };

            var result = ser.deserialize(JSON.stringify(success));

            delete success.jsonrpc;

            it('should return a success object', function () {
                result.type.should.eql('success');
                result.payload.should.eql(success);
            });
        });

        describe('for error object', function () {
            var error = {
                jsonrpc : '2.0',
                id      : 'id',
                error   : {}
            };

            var result = ser.deserialize(JSON.stringify(error));

            delete error.jsonrpc;

            it('should return a error object', function () {
                result.type.should.eql('error');
                result.payload.should.eql(error);
            }); 
        });
    });
});