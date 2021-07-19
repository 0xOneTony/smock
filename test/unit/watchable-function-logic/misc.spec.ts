import chai, { expect } from 'chai';
import { ethers } from 'hardhat';
import { FakeContract, lopt } from '@lib';
import { Caller, Caller__factory, Receiver } from '@typechained';

chai.should();
chai.use(lopt.matchers);

describe('WatchableFunctionLogic: Miscellaneous', () => {
  let fake: FakeContract<Receiver>;
  let caller: Caller;

  before(async () => {
    const callerFactory = (await ethers.getContractFactory('Caller')) as Caller__factory;
    caller = await callerFactory.deploy();
  });

  beforeEach(async () => {
    fake = await lopt.fake<Receiver>('Receiver');
  });

  it('should separate calls from different spies with the same factory', async () => {
    const otherWatchableContract = await lopt.fake<Receiver>('Receiver');
    await caller.call(fake.address, fake.interface.encodeFunctionData('receiveBoolean', [true]));
    otherWatchableContract.receiveBoolean.should.not.have.been.called;
  });

  it('should throw when always flag is used in an unsupported method', async () => {
    expect(() => {
      fake.receiveBoolean.should.always.have.been.calledOnceWith(true);
    }).to.throw('always flag is not supported for method calledOnceWith');
  });
});
