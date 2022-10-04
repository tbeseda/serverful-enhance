export default {
	callbackWaitsForEmptyEventLoop: false,
	functionName: "",
	functionVersion: "",
	invokedFunctionArn: "",
	memoryLimitInMB: "",
	awsRequestId: "",
	logGroupName: "",
	logStreamName: "",
	getRemainingTimeInMillis: function () {
		throw new Error("Function 'getRemainingTimeInMillis' not implemented.");
	},
	done: function (_error, _result) {
		throw new Error("Function 'done' not implemented.");
	},
	fail: function (_error) {
		throw new Error("Function 'fail' not implemented.");
	},
	succeed: function (_messageOrObject) {
		throw new Error("Function 'succeed' not implemented.");
	},
};
