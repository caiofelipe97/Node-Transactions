import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions
      .filter((transaction: Transaction) => transaction.type === 'income')
      .map((transaction: Transaction) => transaction.value)
      .reduce((acc, value) => {
        const accumulator = acc + value;
        return accumulator;
      }, 0);
    const outcome = transactions
      .filter((transaction: Transaction) => transaction.type === 'outcome')
      .map((transaction: Transaction) => transaction.value)
      .reduce((acc, value) => {
        const accumulator = acc + value;
        return accumulator;
      }, 0);
    const total = income - outcome;
    const balance = { income, outcome, total };
    return balance;
  }
}

export default TransactionsRepository;
