import { SetMetadata } from '@nestjs/common';
import { PUBLIC_ROUTE_KEY } from 'src/consts/consts';

export const IS_PUBLIC_KEY = PUBLIC_ROUTE_KEY;
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);