import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '@nestjs/passport';
import { RequestService } from 'src/request/request.service';

@Injectable()
export class FtAuthGuard extends AuthGuard('42') {}
