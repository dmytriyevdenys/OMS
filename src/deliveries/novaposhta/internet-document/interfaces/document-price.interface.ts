
export interface DocumentPrice { 
    CitySender: string;         
    CityRecipient: string;      
    Weight: string;           
    ServiceType: string;        
    Cost: string;               
    CargoType: string; 
    RedeliveryCalculate?: { 
        CargoType: string,
        Amount: string
    }    
}