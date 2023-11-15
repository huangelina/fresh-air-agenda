from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventIn(BaseModel):
    name : str
    date: datetime
    image_url: str
    description: Optional[str]
    location: str
    hosted_by: int
