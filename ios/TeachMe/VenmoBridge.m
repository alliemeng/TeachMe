//
//  VenmoBridge.m
//  TeachMe
//
//  Created by Feifan Zhou on 11/7/15.
//  Copyright © 2015 Facebook. All rights reserved.
//

#import <Venmo-iOS-SDK/venmo.h>
#import "VenmoBridge.h"

@implementation VenmoBridge
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(sendPaymentTo:(NSString *)target amount:(NSUInteger)cents message:(NSString *)message) {
	[[Venmo sharedInstance] sendPaymentTo:target amount:cents note:message completionHandler:^(VENTransaction *transaction, BOOL success, NSError *error) {
		if (error)
			 NSLog(@"Transaction failed with error: %@", [error localizedDescription]);
	}];
}
@end
