import { IsString, IsOptional, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingIntent, PropertySegment } from '@prisma/client';

export class PropertyLocationDto {
  @IsString() addressLine1: string;
  @IsString() @IsOptional() addressLine2?: string;
  @IsString() locality: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() pincode: string;
}

export class PropertyPricingDto {
  @IsNumber() amount: number;
  @IsString() @IsOptional() currency?: string;
}

export class PropertyFeatureDto {
  @IsNumber() @IsOptional() bhk?: number;
  @IsNumber() areaSqFt: number;
  @IsString() @IsOptional() furnishing?: string;
}

export class CreatePropertyDto {
  @IsString() title: string;
  @IsString() @IsOptional() description?: string;
  @IsEnum(ListingIntent) intent: ListingIntent;
  @IsEnum(PropertySegment) segment: PropertySegment;

  @ValidateNested() @Type(() => PropertyLocationDto) location: PropertyLocationDto;
  @ValidateNested() @Type(() => PropertyPricingDto) pricing: PropertyPricingDto;
  @ValidateNested() @Type(() => PropertyFeatureDto) features: PropertyFeatureDto;

  @IsArray() @IsOptional() amenities?: string[];
}

export class FilterPropertyDto {
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsEnum(ListingIntent) intent?: ListingIntent;
  @IsOptional() @IsNumber() minPrice?: number;
  @IsOptional() @IsNumber() maxPrice?: number;
  @IsOptional() @IsNumber() bhk?: number;
}
