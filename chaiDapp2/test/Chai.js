// SPDX-License-Identifier: MIT
const { expect } = require('chai');

describe('Chai', function () {
  let chai;
  let owner;

  beforeEach(async function () {
    const Chai = await ethers.getContractFactory('chai');
    chai = await Chai.deploy();
    [owner] = await ethers.getSigners();
  });

  it('Should allow buying chai and storing memos', async function () {
    await chai.buyChai('John Doe', 'Hello World!', { value: ethers.utils.parseEther('1') });
    const memos = await chai.getMemos();
    expect(memos.length).to.equal(1);
    expect(memos[0].name).to.equal('John Doe');
    expect(memos[0].message).to.equal('Hello World!');
    expect(memos[0].from).to.equal(owner.address);
  });

  it('Should not allow buying chai for zero ether', async function () {
    await expect(chai.buyChai('John Doe', 'Hello World!', { value: 0 })).to.be.revertedWith('Please pay greater than 0 ether');
  });
});
