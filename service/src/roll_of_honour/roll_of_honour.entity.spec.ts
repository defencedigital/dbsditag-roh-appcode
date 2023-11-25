import { RollOfHonour } from './roll_of_honour.entity';

describe('RollOfHonourEntity', () => {
  it('should be defined', () => {
    expect(new RollOfHonour()).toBeDefined();
  });

  it('should have a service', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.service = 'Army';
    expect(rollOfHonour.service).toEqual('Army');
  });

  it('should have a surname', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.surname = 'Smith';
    expect(rollOfHonour.surname).toEqual('Smith');
  });

  it('should have a forenames', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.forenames = 'John';
    expect(rollOfHonour.forenames).toEqual('John');
  });

  it('should have a service number', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.service_no = '123456';
    expect(rollOfHonour.service_no).toEqual('123456');
  });

  it('should have a rank', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.rank = 'Private';
    expect(rollOfHonour.rank).toEqual('Private');
  });

  it('should have a regt_corps', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.regt_corps = 'Royal Engineers';
    expect(rollOfHonour.regt_corps).toEqual('Royal Engineers');
  });

  it('should have a birth_date', () => {
    const rollOfHonour = new RollOfHonour();
    rollOfHonour.birth_date = '01/01/1910';
    expect(rollOfHonour.birth_date).toEqual('01/01/1910');
  });
});
