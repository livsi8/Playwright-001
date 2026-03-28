import { BrandAccount } from '../../config/types';
import { Logger } from '../logger/logger';

export class AccountManager {
  public static allocate(accounts: readonly BrandAccount[], workerIndex: number): BrandAccount {
    if (accounts.length === 0) {
      throw new Error('Account pool is empty.');
    }

    if (workerIndex >= accounts.length) {
      throw new Error(
        `Worker ${workerIndex} has no dedicated account. Configure at least ${workerIndex + 1} accounts for this brand.`
      );
    }

    const account = accounts[workerIndex];

    // The allocation is deterministic and worker-scoped, so no shared mutable state is needed.
    Logger.system('AccountManager', `Allocated account ${account.email} to worker ${workerIndex}`);

    return account;
  }
}
