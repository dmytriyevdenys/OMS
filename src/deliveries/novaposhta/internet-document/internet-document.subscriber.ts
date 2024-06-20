import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { InternetDocumnetEntity } from './entities/internet-document.entity';
import { Subject } from 'rxjs';

@EventSubscriber()
export class InternetDocumentSubscriber implements EntitySubscriberInterface<InternetDocumnetEntity> {
  private dataSubject = new Subject<InternetDocumnetEntity>();

  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo(): string | Function {
    return InternetDocumnetEntity;
  }

  afterInsert(event: InsertEvent<InternetDocumnetEntity>): void | Promise<void> {
    const newData = event.entity;
    this.dataSubject.next(newData);
  }

  get(): Subject<InternetDocumnetEntity> {
    return this.dataSubject;
  }
}
