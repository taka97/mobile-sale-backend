import { Router } from 'express';

import authenticationRouter from './authentication';
import adminRouter from './admin';
import staffRouter from './staff';
import customerRouter from './customer';
import categoryRouter from './category';
import productRouter from './product';
import commentRouter from './comment';
import productSeenRouter from './product-seen';
import cartRouter from './cart';
import checkoutRouter from './checkout';
import orderRouter from './order';
import seederRouter from './seeder';

const router = Router();

/**
 * @swagger
 * definitions:
 *  Authentication:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *        example: 'admin@gmail.com'
 *      password:
 *        type: string
 *        example: 'Abc12345'
 *      strategy:
 *        type: string
 *        default: customer
 *        example: 'admin'
 *        enum: ['customer', 'staff', 'admin']
 *    required:
 *      - email
 *      - password
 *  AuthenticationResponse:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *      accessToken:
 *        type: string
 *    required:
 *      - userId
 *      - accessToken
 *  PasswordChange:
 *    type: object
 *    properties:
 *      oldPassword:
 *        type: string
 *      newPassword:
 *        type: string
 *      repeatPassword:
 *        type: string
 *    required:
 *      - oldPassword
 *      - newPassword
 *      - repeatPassword
 *  User:
 *    type: object
 *    properties:
 *      email:
 *        type: string
 *      username:
 *        type: string
 *      fullname:
 *        type: string
 *      avatar:
 *        type: string
 *      cmnd:
 *        type: string
 *      address:
 *        type: string
 *      phone:
 *        type: string
 *      birthDate:
 *        type: string
 *      sex:
 *        type: string
 *        enum: ['male', 'female']
 *    required:
 *      - email
 *      - fullname
 *      - birthDate
 *      - sex
 *  UserResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      email:
 *        type: string
 *      username:
 *        type: string
 *      avatar:
 *        type: string
 *      fullname:
 *        type: string
 *      cmnd:
 *        type: string
 *      address:
 *        type: string
 *      phone:
 *        type: string
 *      birthDate:
 *        type: string
 *      sex:
 *        type: string
 *        enum: ['male', 'female']
 *      roles:
 *        type: string
 *        enum: ['customer', 'staff', 'admin']
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 *  QueryResponse:
 *    type: object
 *    properties:
 *      total:
 *        type: integer
 *      limit:
 *        type: integer
 *      skip:
 *        type: integer
 *      data:
 *        type: array
 *        items:
 *          type: object
 *  Category:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *    required:
 *      - name
 *  CategoryResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 *  Product:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      category:
 *        type: string
 *      price:
 *        type: string
 *      images:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            url:
 *              type: string
 *            caption:
 *              type: string
 *      review:
 *        type: string
 *      shortReview:
 *        type: string
 *      details:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            value:
 *              type: string
 *          required:
 *            - name
 *            - value
 *      options:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            group:
 *              type: string
 *            name:
 *              type: string
 *            value:
 *              type: string
 *          required:
 *            - group
 *            - name
 *            - value
 *    required:
 *      - name
 *      - category
 *      - price
 *  ProductResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      name:
 *        type: string
 *      category:
 *        type: string
 *      price:
 *        type: string
 *      images:
 *        type: object
 *      details:
 *        type: object
 *      options:
 *        type: object
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 *      - name
 *      - category
 *  Comment:
 *    type: object
 *    properties:
 *      productId:
 *        type: string
 *      parentId:
 *        type: string
 *      text:
 *        type: string
 *    required:
 *      - productId
 *      - text
 *  CommentResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      productId:
 *        type: string
 *      parentId:
 *        type: string
 *      text:
 *        type: string
 *      author:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      - _id
 *      - productId
 *      - text
 *      - author
 *  ProductSeen:
 *    type: object
 *    properties:
 *      productId:
 *        type: string
 *    required:
 *      - productId
 *  ProductSeenResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      productId:
 *        type: string
 *      userId:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      _ _id
 *      - productId
 *      - userId
 *  CartResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: string
 *      totalQty:
 *        type: number
 *      totalPrice:
 *        type: number
 *      userId:
 *        type: string
 *      item:
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            item:
 *              type: object
 *            productId:
 *              type: string
 *            priceId:
 *              type: string
 *            price:
 *              type: number
 *            qty:
 *              type: number
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *    required:
 *      _ _id
 *      - productId
 *      - userId
 *  CheckoutResponse:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *      items:
 *        type: array
 *        items:
 *          type: object
 *      currency:
 *        type: string
 *      email:
 *        type: string
 *      shippingAddress:
 *        type: object
 *        properties:
 *          fullname:
 *            type: string
 *          phone:
 *            type: string
 *          address:
 *            type: string
 *          company:
 *            type: string
 *      billingAddress:
 *        type: object
 *        properties:
 *          fullname:
 *            type: string
 *          phone:
 *            type: string
 *          address:
 *            type: string
 *          company:
 *            type: string
 *      shippingMethod:
 *        type: string
 *      shippingTax:
 *        type: number
 *      paymentMethod:
 *        type: string
 *      totalQty:
 *        type: number
 *      totalItemsPrice:
 *        type: number
 *      totalTax:
 *        type: number
 *      totalPrice:
 *        type: number
 *      isCompleted:
 *        type: boolean
 *  OrderResponse:
 *    type: object
 *    properties:
 *      userId:
 *        type: string
 *      items:
 *        type: array
 *        items:
 *          type: object
 *      currency:
 *        type: string
 *      email:
 *        type: string
 *      shippingAddress:
 *        type: object
 *        properties:
 *          fullname:
 *            type: string
 *          phone:
 *            type: string
 *          address:
 *            type: string
 *          company:
 *            type: string
 *      billingAddress:
 *        type: object
 *        properties:
 *          fullname:
 *            type: string
 *          phone:
 *            type: string
 *          address:
 *            type: string
 *          company:
 *            type: string
 *      shippingMethod:
 *        type: string
 *      shippingTax:
 *        type: number
 *      paymentMethod:
 *        type: string
 *      totalQty:
 *        type: number
 *      totalItemsPrice:
 *        type: number
 *      totalTax:
 *        type: number
 *      totalPrice:
 *        type: number
 *      status:
 *        type: boolean
 */

router.use('/authentication', authenticationRouter);
router.use('/admin', adminRouter);
router.use('/staffs', staffRouter);
router.use('/customers', customerRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/comments', commentRouter);
router.use('/productSeen', productSeenRouter);
router.use('/cart', cartRouter);
router.use('/checkouts', checkoutRouter);
router.use('/orders', orderRouter);

router.use('/seeder', seederRouter);

export default router;
