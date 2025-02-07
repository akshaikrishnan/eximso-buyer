export interface Product {
    _id: string;
    name: string;
    // Add other product properties as needed
  }
  export interface WishlistResponse {
    success: boolean;
    message: string;
    data?: any;
  }