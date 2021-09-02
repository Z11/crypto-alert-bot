import { CryptoBotStack } from './crypto-bot-stack';
import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';

test('Test For Stack', () => {
	const app = new App();
	// WHEN
	const stack = new CryptoBotStack(app, 'MyTestStack', { environmentName: 'sandbox' });
	// THEN
	expectCDK(stack).to(haveResource('AWS::SQS::Queue'));
});