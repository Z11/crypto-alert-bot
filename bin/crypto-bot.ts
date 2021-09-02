#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CryptoBotStack } from '../lib/crypto-bot-stack';

const app = new cdk.App();
const environmentName = process.env.ENVIRONMENT ?? 'sandbox';
new CryptoBotStack(app, environmentName + '-CryptoBotStack', { environmentName });
