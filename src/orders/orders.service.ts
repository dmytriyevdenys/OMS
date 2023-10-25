import { Injectable, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdersApiService } from './orders-api/orders-api.service';
import { OrderDto } from './dto/order.dto';
import { BuyerService } from 'src/buyer/buyer.service';
import { OrderEntity } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IntDocDto } from 'src/novaposhta/internet-document/dto/int-doc.dto';
import { InternetDocumentService } from 'src/novaposhta/internet-document/internet-document.service';
import { InternetDocumnetEntity } from 'src/novaposhta/internet-document/entities/internet-document.entity';
import { ApiIntDocService } from 'src/novaposhta/internet-document/api-service/api-int-doc.service';
import { STATUS_CODES } from 'http';
import { UserEntity } from 'src/users/entities/user.entity';
import { ResponseData } from 'src/interfaces/response-data.interface';
import { ResponseService } from 'src/utils/response.service';
import { errorMonitor } from 'events';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersApiService: OrdersApiService,
    private readonly buyerService: BuyerService,
    private readonly entityManager: EntityManager,
    private readonly intDocService: InternetDocumentService,
    private readonly apiIntDocService: ApiIntDocService,
    private readonly responseService: ResponseService,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async createOrder(dto: Partial<OrderDto>, user: UserEntity): Promise<ResponseData<OrderEntity>> {
    try {
      const order = new OrderEntity(dto);
      order.user = user;
      if (dto.buyer && !dto.buyer.id) {
        const buyer = await this.buyerService.createBuyer(dto.buyer);
        order.buyer = buyer;
      }
      const crmOrder = await this.ordersApiService.createOrder(dto);
        order.orderCrm_id = crmOrder.id;
      const newOrder = await this.entityManager.save(order);
      if (!newOrder)
        throw new BadRequestException('Не вдалось створити замовлення');
      
      return await this.responseService.successResponse(newOrder);;
    } catch (error) {
       this.responseService.errorResponse(error.message)
      ;
    }
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto) {
    try {
      const order = await this.findOrderById(orderId);
     const updateOrder =  Object.assign(order, dto);
     await this.ordersApiService.updateOrder(order.orderCrm_id, dto);
      await this.entityManager.save(updateOrder);
      return order;
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders(): Promise<ResponseData<OrderEntity[]>> {
    try {
      const orders = await this.orderRepository.find();
      if (!orders) throw new BadRequestException('Не інсує жодного замовлення');

      return  this.responseService.successResponse(orders);
    } catch (error) {
      throw error;
    }
  }

  async findOrderById(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: {
          user: true,
          products: true,
          buyer: true,
          sender: true
        },
      });
      return order;
    } catch (error) {
      throw error;
    }
  }

  async createIntDoc (orderId: number, dto: IntDocDto): Promise<OrderEntity> {
  try { 
    const order = await this.findOrderById(orderId); 
    const intDoc = await this.intDocService.createIntDoc(dto);
    order.sender = dto.sender;
    order.shipping = intDoc; 
    await this.entityManager.save(order);
    return order;
  } 
  catch (error) { 
    throw error;
  }
}

  async addIntDoc(orderId: number, intDoc: string) { 
    try { 

      const order = await this.findOrderById(orderId);
      const newIntDoc = new InternetDocumnetEntity({
        IntDocNumber: intDoc
      })
      order.shipping = newIntDoc;
      await this.entityManager.save(order);
      return order;
    }
    catch(error) {
      throw error;
    }
  }

  async detachIntDoc (orderId: number) {
    try { 
      const order = await this.findOrderById(orderId);
      await this.entityManager.remove(order.shipping);
      await this.entityManager.remove(order.sender)
      delete order.shipping
      return order;
    
    } 
    catch(error) {
      throw error
    }
  }

  async removeIntDoc (orderId: number) {
    try {
      const order = await this.findOrderById(orderId);
      
      const refIntDoc = order.shipping.Ref ;
      
      const removedIntDoc = await this.apiIntDocService.deleteIntDoc(order, refIntDoc);
      if(removedIntDoc) { 
        const updatedOrder = await this.detachIntDoc(orderId);
      return updatedOrder;
      }
    }catch(error) {
      throw error;
    }
  }

}
