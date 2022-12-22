import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    title: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsaWNlQHN5bWJvbGljcy5jb20iLCJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3MTY5MDk0MywiZXhwIjoxNjcxNjk4MTQzfQ.umRXXZKabpyPIwf4MO31rNURGZSXTCKejtfk8BoSGI0',
  })
  @IsJWT()
  token: string;
}
