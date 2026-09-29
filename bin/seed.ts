#!/usr/bin/env node
import { faker } from '@faker-js/faker';

import db from '../src/database/lib';
import { user } from '../src/database/schema/user';

async function run() {
  const MAX = 10;
  const values: (typeof user.$inferInsert)[] = [];

  for (let i = 0; i < MAX; i++) {
    values.push({
      name: faker.word.noun(),
    });
  }

  await db.insert(user).values(values);
}

run();
