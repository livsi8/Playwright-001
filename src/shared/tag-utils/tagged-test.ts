import { getRuntimeOptions } from '../../config/runtime-options';
import { matchesTagExpression } from './tag-expression';

type TestBody = (args: any, testInfo: any) => Promise<void> | void;

interface PlaywrightTestLike {
  (title: string, body: TestBody): void;
  skip(title: string, body: TestBody): void;
}

export function createTaggedTest(playwrightTest: PlaywrightTestLike) {
  return (title: string, tags: readonly string[], body: TestBody): void => {
    const tagExpression = getRuntimeOptions().tags;
    const shouldRun = matchesTagExpression(tagExpression, tags);
    const testTitle = `${title} ${tags.join(' ')}`;
    const runner = shouldRun ? playwrightTest : playwrightTest.skip;

    runner(testTitle, body);
  };
}
