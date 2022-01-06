import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  DelegateChanged,
  DelegateVotesChanged,
  Transfer
} from "../generated/Candle/Candle"

import { BurnWithMessage } from "../generated/Burner/Burner"
import { User, Burn } from "../generated/schema"

export function handleApproval(event: Approval): void {}

export function handleDelegateChanged(event: DelegateChanged): void {}

export function handleDelegateVotesChanged(event: DelegateVotesChanged): void {}

export function handleTransfer(event: Transfer): void {}

export function handleBurnWithMessage(event: BurnWithMessage): void {

  let user = getOrCreateUser(event.transaction.from)

  user.burnCount += BigInt.fromI32(1)
  user.burnAmount += event.params.amount

  user.save()

  let burnId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()

  let burn = new Burn(burnId)
  burn.burner = event.transaction.from.toHex()
  burn.amount = event.params.amount
  burn.message = event.params.message

  burn.save()
}

export function getOrCreateUser(userAddress: Address): User {
  let user = User.load(userAddress.toHex())

  if (!user) {
    user = new User(userAddress.toHex())
  }

  return user as User
}